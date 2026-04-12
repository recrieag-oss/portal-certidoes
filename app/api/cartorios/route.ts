import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

type Cartorio = {
  uf: string;
  nome: string;
  municipio: string;
  cep: string;
  atribuicoes: string[];
  comarca: string;
};

let _cache: Cartorio[] | null = null;
function getCartorios(): Cartorio[] {
  if (!_cache) {
    const raw = readFileSync(join(process.cwd(), "data", "cartorios.json"), "utf-8");
    _cache = JSON.parse(raw);
  }
  return _cache!;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const uf = searchParams.get("uf")?.toUpperCase().trim();
  const municipio = searchParams.get("municipio");
  const tipo = searchParams.get("tipo"); // nascimento | casamento | obito | etc.

  const all = getCartorios();

  // Return list of unique municipalities for a state
  if (uf && !municipio) {
    const municipios = [
      ...new Set(
        all
          .filter((c) => c.uf === uf)
          .map((c) => c.municipio)
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
    return NextResponse.json(municipios);
  }

  // Return cartórios for a state + municipality, optionally filtered by service type
  if (uf && municipio) {
    const normMun = normalize(municipio);
    let results = all.filter(
      (c) => c.uf === uf && normalize(c.municipio) === normMun
    );

    if (tipo) {
      const normTipo = normalize(tipo);
      const atribMap: Record<string, string[]> = {
        nascimento: ["nascimentos"],
        casamento: ["casamentos"],
        obito: ["óbitos", "obitos"],
        imovel: ["registro de imóveis", "registro de imoveis"],
        notas: ["notas"],
      };
      const keywords = atribMap[normTipo] ?? [normTipo];
      results = results.filter((c) =>
        keywords.some((kw) => c.atribuicoes.some((a) => normalize(a).includes(normalize(kw))))
      );
    }

    return NextResponse.json(results);
  }

  // Return list of all states (just UFs)
  if (!uf) {
    const ufs = [...new Set(all.map((c) => c.uf))].sort();
    return NextResponse.json(ufs);
  }

  return NextResponse.json([]);
}
