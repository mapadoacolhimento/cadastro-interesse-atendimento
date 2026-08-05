"use client";
import Link from "next/link";
import {
	Box,
	Button,
	Flex,
	Link as ExternalLink,
	Text,
	Strong,
} from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";
import Image from "next/image";

export default function Homepage() {
	return (
		<>
			<Box>
				<MainTitle>Cadastro temporariamente fechado :( </MainTitle>
				<Text align={"center"} as={"p"}>
					Sentimos muito por isso. Neste momento, não estamos aceitando novos pedidos de atendimento. 
					Deixe seu contato para ser avisada assim que reabrirmos.
				</Text>
			</Box>
            <Box px={"5"}
			style={{
				backgroundColor: "var(--pink-3)",
				borderRadius: "var(--radius-3)",
				border: "1px solid",
				borderColor: "var(--pink-4)",
			}}
		    >
				<ul style={{ margin: 0, padding: 0 }}>
				
					<Flex
						align={"center"}
						gap={"4"}
						py={"4"}
						asChild
						style={{
							borderBottom: "1px solid",
							borderColor: "var(--gray-a6)",
						}}
					>
						<li>
							<Image src="/icons/heart.svg" alt="Ícone de um coração" width={25} height={25} />
							<Text size={{ initial: "1", md: "2" }}>Estamos com muitas mulheres na fila de espera por um atendimento e, no momento, não temos voluntárias suficientes para acolher novos pedidos.</Text>
						</li>
					</Flex>
					<Flex
						align={"center"}
						gap={"4"}
						py={"4"}
						asChild
						style={{
							borderBottom: "1px solid",
							borderColor: "var(--gray-a6)",
						}}
					>
						<li>
							<Image src="/icons/user-profile.svg" alt="Ícone de um perfil de usuário" width={25} height={25} />
							<Text size={{ initial: "1", md: "2" }}>Deixando seus dados, você será avisada por e-mail assim que o cadastro for reaberto.</Text>
						</li>
					</Flex>
										<Flex
						align={"center"}
						gap={"4"}
						py={"4"}
						asChild
						style={{
							borderBottom: "1px solid",
							borderColor: "var(--gray-a6)",
						}}
					>
						<li>
							<Image src="/icons/planner.svg" alt="Ícone de uma agenda" width={25} height={25} />
							<Text size={{ initial: "1", md: "2" }}>Não temos como garantir um prazo para essa reabertura, mas você pode contar com a gente: assim que houver novas vagas, entraremos em contato.</Text>
						</li>
					</Flex>
				</ul>

            </Box>
			<Flex
				direction={"column"}
				align={"center"}
				gap={{ initial: "5", md: "6" }}
			>
				<Button size={"4"} asChild>
					<Link href={"/cadastro"} prefetch={true}>
						Quero ser avisada
					</Link>
				</Button>

				<Text as={"p"} size={"2"} align={"center"}>
					Se você precisa de um atendimento de urgência, Ligue 180 e/ou{" "}
				<Strong>
				<ExternalLink
				 	href="https://www.mapadoacolhimento.org/servicos-publicos/"
					target="_blank"
					rel="noopener noreferrer"
				>
				{" "}busque o serviço público
				</ExternalLink>
				</Strong>
				{" "}mais próximo de você. 
				</Text>
			</Flex>
			<Box display={{ initial: "none", md: "block" }}>
				<Illustration
					align={"end"}
					img={{
						src: "/illustrations/computer.webp",
						alt: "Ilustração de um computador coração na tela.",
					}}
				/>
			</Box>
		</>
	);
}
