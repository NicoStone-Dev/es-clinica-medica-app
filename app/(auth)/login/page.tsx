"use client";

import { TextInput } from "../../components/TextInput/TextInput";
import { Button } from "../../components/Button/Button";
import { ToggleSwitch } from "../../components/ToggleSwitch/ToggleSwitch";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import ArrowIcon from "@mui/icons-material/ArrowForwardIos";

export default function login() {
  return (
    <div className="flex flex-row justify-center h-screen">
      <div className="relative flex flex-col w-full h-full overflow-hidden bg-blue-200">
        <Image
          src="/images/bg-image.png"
          fill
          className="object-cover"
          alt=""
        />
      </div>
      {/* form container */}
      <div className="flex flex-col items-center bg-[radial-gradient(45.07%_45.07%_at_50.09%_54.93%,_var(--color-blue-gray-200,#DCE9FF)_0%,_#FFF_100%)] justify-center w-175 px-[42px] py-[24px] ">
        <div className="flex flex-col justify-center w-[360px] gap-10.5 ">
          <div className="flex flex-col">
            <h1 className="font-bold text-title leading-12 text-primary">
              Instituto Barbarossa e Associados
            </h1>
            <p className="font-medium text-body-emph leading-8 text-blue-gray-400">
              Sistema de Gestão de Consultas
            </p>
          </div>
          {/* componentize the switch */}
          <div>
            <ToggleSwitch
              primaryState="Profissional"
              secondaryState="Administrador"
            />
          </div>
          {/* actual form */}
          <div className="flex flex-col gap-4 font-regular text-body text-blue-gray-700">
            <p>Email</p>
            <TextInput
              leftIcon={<PersonIcon />}
              placeholder="email@dominio.com"
            />
            <div className="flex flex-row justify-between">
              <p>Senha</p>
              <p className="font-regular text-small text-blue-gray-400 underline">
                Esqueceu a senha?
              </p>
            </div>
            <TextInput leftIcon={<LockIcon />} placeholder="*********" />
            <div className="flex flex-row gap-4">
              <input
                type="checkbox"
                className="flex w-4 h-4 outline-0 rounded-xs cursor-pointer inset-shadow-sm bg-blue-200 "
              />
              <p className="font-regular text-small text-blue-gray-400 underline">
                Lembrar neste dispositivo?
              </p>
            </div>
          </div>
          <Button rightIcon={<ArrowIcon />}>Entrar</Button>
        </div>
      </div>
    </div>
  );
}
