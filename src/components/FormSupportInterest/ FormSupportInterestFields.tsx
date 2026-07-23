import { Box } from "@radix-ui/themes";
import { TextInput, SelectInput } from "..";
import { supportTypeOptions } from "@/lib";
import { Flex } from "@radix-ui/themes";

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
			<Box pt={"3"}>
				<SelectInput
					name="supportType"
					label="Tipo de atendimento desejado"
					options={supportTypeOptions}
					placeholder="Tipo de atendimento"
				/>
			</Box>
		</>
	);
}

export default function  formSupportInterestFields() {
	return (
		<Flex direction={"column"} gap={"4"} width={"100%"}>
			< FormSupportInterestFields />
		</Flex>
	);
}
