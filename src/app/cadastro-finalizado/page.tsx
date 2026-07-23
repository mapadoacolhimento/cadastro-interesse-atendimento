"use client";

import { Box, Text } from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import ExtraSupport from "@/components/ExtraSupport";
import MainTitle from "@/components/MainTitle";

export default function Page() {
	return (
		<>
			<Box>
				<MainTitle>Cadstro Finalizado!</MainTitle>
				<Text
					as={"p"}
					align={"center"}
					style={{ paddingBottom: "var(--space-5)" }}
				>
					Entraremos em contato por e-mail assim que o cadastro for reaberto.
				</Text>
				<ExtraSupport />
			</Box>
			<Illustration
				align={"end"}
				img={{
					src: "/illustrations/woman.webp",
					alt: "Ilustração de uma mulher com cabelo castanho escuro e blusa roxa com um coração branco do mapa do acolhimento.",
				}}
			/>
		</>
	);
}
