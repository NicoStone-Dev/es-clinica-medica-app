import { getCookie, TOKEN_COOKIE_NAME } from "./cookies";

// URL base da API. Configurada no arquivo .env.local (veja .env.local.example).
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// Erro customizado: guarda o status HTTP (401, 403, 400...) junto com a
// mensagem, assim cada tela decide como reagir (ex: 401 = "senha errada").
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // false = não envia o token (usado só no login)
};

// Função central para chamar a API. Toda tela deve usar essa função em vez
// de "fetch" direto, para já vir com o token JWT e o tratamento de erro prontos.
//
// Exemplos de uso:
//   apiFetch<Page<MedicoResumo>>("/medicos")
//   apiFetch<MedicoDetalhe>("/medicos/5")
//   apiFetch("/pacientes", { method: "POST", body: dadosDoPaciente })
export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // DELETE bem-sucedido (204 No Content) não tem corpo para converter em JSON
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem =
      data?.mensagem ||
      data?.message ||
      data?.error ||
      `Erro ${response.status} ao acessar ${path}`;
    throw new ApiError(response.status, mensagem);
  }

  return data as T;
}
