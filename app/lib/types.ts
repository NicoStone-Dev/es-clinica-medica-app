// Tipos que espelham os DTOs (records) do backend Java.
// Se um DTO do backend mudar, atualize o tipo correspondente aqui.

export type Especialidade =
  | "ORTOPEDIA"
  | "CARDIOLOGIA"
  | "GINECOLOGIA"
  | "DERMATOLOGIA";

export type Papel = "ADMINISTRADOR" | "RECEPCIONISTA" | "MEDICO";

export type Endereco = {
  rua: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  complemento?: string;
  numero?: string;
};

// --- Autenticação: POST /auth/login ---
export type LoginResponse = {
  token: string;
};

// --- Usuários do sistema ---
// usado em POST /usuarios (somente ADMINISTRADOR). O papel MEDICO não é aceito
// aqui: usuários médicos são criados automaticamente em POST /medicos.
export type NovoUsuario = {
  login: string;
  senha: string;
  papel: Papel;
};

export type UsuarioDetalhe = {
  id: number;
  login: string;
  papel: Papel;
};

// --- Médicos ---
export type MedicoResumo = {
  id: number;
  nome: string;
  email: string;
  crm: string;
  telefone: string;
  especialidade: Especialidade;
};

export type MedicoDetalhe = MedicoResumo & {
  endereco: Endereco;
};

// usado em POST /medicos
export type NovoMedico = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  crm: string;
  especialidade: Especialidade;
  endereco: Endereco;
};

// usado em PUT /medicos
export type AtualizacaoMedico = {
  id: number;
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
};

// --- Pacientes ---
export type PacienteResumo = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
};

export type PacienteDetalhe = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
};

// usado em POST /pacientes
export type NovoPaciente = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
};

// usado em PUT /pacientes
export type AtualizacaoPaciente = {
  id: number;
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
};

// --- Consultas ---
// usado em POST /consultas
// medicoId e especialidade são opcionais: se medicoId não for enviado,
// o backend escolhe automaticamente um médico ativo da especialidade informada.
export type NovaConsulta = {
  pacienteId: number;
  medicoId?: number;
  especialidade?: Especialidade;
  dataHora: string; // formato ISO local, ex: "2026-07-01T14:30:00"
};

export type ConsultaDetalhe = {
  id: number;
  medicoId: number;
  medicoNome: string;
  pacienteId: number;
  pacienteNome: string;
  dataHora: string;
};

// --- Dashboard: GET /dashboard (somente ADMINISTRADOR) ---
export type DashboardResumo = {
  totalConsultas: number;
  totalMedicosAtivos: number;
  totalPacientesAtivos: number;
  // chave = nome da especialidade (ex: "CARDIOLOGIA"), valor = nº de consultas
  consultasPorEspecialidade: Record<string, number>;
};

// --- Paginação (Spring Data Page<T>, usado em GET /medicos e GET /pacientes) ---
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual, começando em 0
  size: number;
};
