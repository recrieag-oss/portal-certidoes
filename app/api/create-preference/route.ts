import { NextResponse } from "next/server";
import { createMercadoPagoPreference } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const preference = await createMercadoPagoPreference(body);

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Erro interno" },
      { status: 500 },
    );
  }
}
