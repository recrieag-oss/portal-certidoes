"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { estadosBrasileiros, estadoUFMap } from "@/lib/constants";
import { CertidaoFormValues, CertidaoType } from "@/lib/types";
import { MapPin, Building2, CheckCircle2, Loader2, Search } from "lucide-react";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

type Cartorio = {
  uf: string;
  nome: string;
  municipio: string;
  cep: string;
  atribuicoes: string[];
  comarca: string;
};

interface Props {
  tipo: CertidaoType;
}

export function StepLocalizacao({ tipo }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  const estado = watch("estado");
  const cidade = watch("cidade");
  const cartorio = watch("cartorio");
  const naoSeiCartorio = watch("naoSeiCartorio");

  const uf = estado ? estadoUFMap[estado] : null;

  const [municipios, setMunicipios] = useState<string[]>([]);
  const [cartorios, setCartorios] = useState<Cartorio[]>([]);
  const [loadingMun, setLoadingMun] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [busca, setBusca] = useState("");

  // Fetch municipalities when state changes
  useEffect(() => {
    if (!uf) {
      setMunicipios([]);
      setCartorios([]);
      setValue("cidade", "");
      setValue("cartorio", "");
      return;
    }
    setLoadingMun(true);
    fetch(`/api/cartorios?uf=${uf}`)
      .then((r) => r.json())
      .then((data: string[]) => setMunicipios(data))
      .finally(() => setLoadingMun(false));
    setValue("cidade", "");
    setValue("cartorio", "");
    setCartorios([]);
  }, [uf]);

  // Fetch cartórios when city changes
  useEffect(() => {
    if (!uf || !cidade) {
      setCartorios([]);
      setValue("cartorio", "");
      return;
    }
    setLoadingCart(true);
    fetch(`/api/cartorios?uf=${uf}&municipio=${encodeURIComponent(cidade)}&tipo=${tipo}`)
      .then((r) => r.json())
      .then((data: Cartorio[]) => setCartorios(data))
      .finally(() => setLoadingCart(false));
    setValue("cartorio", "");
    setBusca("");
  }, [cidade, uf, tipo]);

  const filtered = busca
    ? cartorios.filter((c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.comarca.toLowerCase().includes(busca.toLowerCase())
      )
    : cartorios;

  const selectClass =
    "w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-50";

  return (
    <div className="space-y-6">
      {/* Step 1 – Estado */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-brand-500" /> Estado
          </span>
          <SearchableSelect
            options={estadosBrasileiros}
            value={estado}
            onChange={(val) => setValue("estado", val, { shouldValidate: true })}
            placeholder="Digite ou selecione o estado"
            badges={estadoUFMap}
          />
          {errors.estado && <p className="text-sm text-danger-600">{errors.estado.message}</p>}
        </div>

        {/* Step 2 – Cidade */}
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Building2 className="h-4 w-4 text-brand-500" /> Cidade
            {loadingMun && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
          </span>
          <SearchableSelect
            options={municipios}
            value={cidade}
            onChange={(val) => setValue("cidade", val, { shouldValidate: true })}
            placeholder={!uf ? "Selecione o estado primeiro" : "Digite ou selecione a cidade"}
            disabled={!uf || loadingMun}
            loading={loadingMun}
            loadingMessage="Carregando cidades..."
            noOptionsMessage="Nenhuma cidade encontrada"
          />
          {errors.cidade && <p className="text-sm text-danger-600">{errors.cidade.message}</p>}
        </div>
      </div>

      {/* Step 3 – Cartório search results */}
      {cidade && !naoSeiCartorio && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Building2 className="h-4 w-4 text-brand-500" />
              Cartórios em {cidade} – {estado}
              {loadingCart && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
            </span>
            {cartorios.length > 4 && (
              <span className="text-xs text-slate-400">{filtered.length} encontrados</span>
            )}
          </div>

          {/* Search input within results */}
          {cartorios.length > 4 && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cartório pelo nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          )}

          {loadingCart ? (
            <div className="flex items-center justify-center rounded-[24px] bg-slate-50 py-10">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              <span className="ml-2 text-sm text-slate-500">Buscando cartórios...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[24px] bg-amber-50 p-5 text-sm text-slate-700">
              Nenhum cartório encontrado para esta cidade. Marque a opção abaixo para continuar sem especificar.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((c) => {
                const selected = cartorio === c.nome;
                return (
                  <button
                    key={c.nome + c.cep}
                    type="button"
                    onClick={() => setValue("cartorio", selected ? "" : c.nome, { shouldValidate: true })}
                    className={`flex items-start gap-3 rounded-[20px] border p-4 text-left transition ${
                      selected
                        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                        : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        selected ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {selected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold capitalize text-slate-900 leading-tight">
                        {c.nome}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        CEP {c.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}
                        {c.comarca && ` · Comarca de ${c.comarca}`}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.atribuicoes.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] capitalize text-slate-600"
                          >
                            {a}
                          </span>
                        ))}
                        {c.atribuicoes.length > 3 && (
                          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">
                            +{c.atribuicoes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {errors.cartorio && !naoSeiCartorio && (
            <p className="text-sm text-danger-600">{errors.cartorio.message}</p>
          )}
        </div>
      )}

      {/* "Don't know cartório" checkbox */}
      <label className="inline-flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
          {...register("naoSeiCartorio")}
          onChange={(e) => {
            register("naoSeiCartorio").onChange(e);
            if (e.target.checked) setValue("cartorio", "");
          }}
        />
        Não sei o nome do cartório — a equipe irá localizar por mim
      </label>

      {naoSeiCartorio && (
        <div className="rounded-[24px] border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-slate-700">
          Nossa equipe realizará a busca pelo registro nos cartórios da região informada. Pode ser cobrada uma taxa de busca a partir de <strong>R$ 100,00</strong>.
        </div>
      )}
    </div>
  );
}
