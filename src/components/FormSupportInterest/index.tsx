"use client";

import { formatRegisterFormValues } from "@/utils";
import {useState,} from "react";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { Box, Flex, Link as ExternalLink,Text, Strong } from "@radix-ui/themes";
import { Illustration } from "@/components";
import { Status,type Values } from "@/types";
import * as Yup from "yup";
import { TextInput, SelectInput, MainTitle } from "..";
import { logger, supportTypeOptions, BRAZILIAN_STATES_OPTIONS } from "@/lib";


const formSupportInterestFieldsSchema = Yup.object({
	firstName: Yup.string()
		.required("Insira seu primeiro nome.")
		.max(200, "Insira apenas seu primeiro nome."),
	email: Yup.string()
		.email("Insira um e-mail válido.")
		.required("Insira seu e-mail.")
		.max(200, "Insira apenas seu e-mail."),
	confirmEmail: Yup.string()
		.oneOf([Yup.ref("email")], "Os e-mails precisam ser iguais.")
		.required("Esse campo é obrigatório."),
	supportType: Yup.array()
		.of(Yup.string().oneOf(["psychological", "legal", "legal_and_psychological"]))
		.required("Esse campo é obrigatório."),
});

function FormSupportInterestFields() {
	
	return (
		<>
			<Box pt={"3"}>
				<TextInput
					name="firstName"
					label="Primeiro nome"
					placeholder="Qual o seu primeiro nome?"
				/>
			</Box>
			<TextInput
				name="email"
				type="email"
				label="E-mail"
				placeholder="Qual o seu melhor e-mail?"
			/>
			<TextInput
				name="confirmEmail"
				type="email"
				label="Confirme seu e-mail"
				placeholder="Confirme seu e-mail"
			/>
			<SelectInput
				name="state"
				label="Estado"
				options={BRAZILIAN_STATES_OPTIONS}
				placeholder="Selecione seu estado"
			/>
			<SelectInput
					name="supportType"
					label="Tipo de atendimento desejado"
					options={supportTypeOptions}
					placeholder="Tipo de atendimento"
			/>
			
		</>
	);
}


export default function FormSupportInterest() {
	
	const [form, setForm] = useState<Values>({
		firstName: "",
		email:"",
		confirmEmail:"",
		state:"",
		supportType:"", });
 	const [status, setStatus] = useState<Status | null>(Status.idle);
	const router = useRouter();
	async function onSubmit(values: Values) {
		
		try {
			setStatus(Status.idle);
			const formattedValues = formatRegisterFormValues(values);

			const response = await fetch("/handle-request", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: formattedValues,
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return router.push("/cadastro-finalizado");
			
		} catch (error) {
			logger.error(error);
			setStatus(Status.error);
		}

	}
  
	return  (
		<>
			<Formik
				initialValues={
					{
						email: "",
						firstName: "",
						confirmEmail: "",
						state: "",
						supportType:""}
					}
				onSubmit={onSubmit}
				validationSchema={formSupportInterestFieldsSchema}
			>
				{() => (
					<Form style={{ width: "100%" }}>

						<>
						   <MainTitle>Registre seu interesse em receber atendimento</MainTitle>
						   <Text align={"center"} as={"p"}>
							Assim que o cadastro for reaberto, avisaremos você por e-mail.
							</Text>
							<Flex
								direction={"column"}
								align={"center"}
								justify={"center"}
								gapY={"4"}
							>
								<Flex direction={"column"} gap={"4"} width={"100%"}>
								< FormSupportInterestFields />
								</Flex>
							</Flex>
							<Text as={"p"} size={"2"} align={"center"}>
					         Se você precisa de um atendimento de urgência, Ligue 180 e/ou
								<Strong>
								<ExternalLink
								href="https://www.mapadoacolhimento.org/servicos-publicos/"
								target="_blank"
								rel="noopener noreferrer"
								>
								busque o serviço público
								</ExternalLink>
								</Strong>
								mais próximo de você. 
							</Text>
							<Text as={"p"} size={"2"} align={"center"}>
							Ao deixar seus dados você está de acordo com a nossa{" "}
							<Strong>
							<ExternalLink
							href="https://docs.google.com/document/d/e/2PACX-1vTI5h8RBjeC7MkZ4bAponamp02YdYhjhPCJC0dQ2kp7inzA1LPoiE_JFgOwmbwv1PPJvU4pMqfEEQn9/pub"
							target="_blank"
							rel="noopener noreferrer"
							>
							política de privacidade
							</ExternalLink>
							</Strong>
							.
							</Text>
						</>
					</Form>
					
				)}
			</Formik>
			<Illustration
				img={{
				src: "/illustrations/woman-floating.webp",
				alt: "Ilustração com uma mulher flutuando.",
				}}
			/>
		</>
	);
}
