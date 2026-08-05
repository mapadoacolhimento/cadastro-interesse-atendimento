import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}));

vi.mock("react-select", () => ({
	__esModule: true,
	default: ({ options, onChange, value, placeholder, name }: any) => (
		<select
			id={name}
			name={name}
			data-testid={`react-select-${name}`}
			value={value?.value ?? ""}
			onChange={(event) => {
				const selected = options.find((option: any) => option.value === event.target.value);
				onChange(selected ?? null);
			}}
		>
			<option value="">{placeholder}</option>
			{options.map((option: any) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import FormSupportInterest from "../index";

const fillTextField = async (label: string, value: string) => {
	const field = screen.getByLabelText(label);
	await userEvent.clear(field);
	await userEvent.type(field, value);
};

const selectOption = async (label: string, value: string) => {
	const select = screen.getByTestId(`react-select-${label === "Estado" ? "state" : "supportType"}`);
	fireEvent.change(select, { target: { value } });
};

describe("FormSupportInterest", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders the form fields and submit button", () => {
		render(<FormSupportInterest />);

		expect(screen.getByLabelText("Primeiro nome")).toBeInTheDocument();
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirme seu e-mail")).toBeInTheDocument();
		expect(screen.getByLabelText("Estado")).toBeInTheDocument();
		expect(screen.getByLabelText("Tipo de atendimento desejado")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
	});

	it("submits the form and navigates on success", async () => {
		mockFetch.mockResolvedValueOnce({ ok: true } as Response);

		render(<FormSupportInterest />);

		await fillTextField("Primeiro nome", "Maria");
		await fillTextField("E-mail", "maria@example.com");
		await fillTextField("Confirme seu e-mail", "maria@example.com");
		await selectOption("Estado", "SP");
		await selectOption("Tipo de atendimento desejado", "psychological");

		await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(pushMock).toHaveBeenCalledWith("/cadastro-finalizado");
		});
	});

	it("shows validation errors when required fields are empty", async () => {
		render(<FormSupportInterest />);

		await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

		const requiredErrors = await screen.findAllByText("Esse campo é obrigatório.");
		expect(requiredErrors).toHaveLength(3);
		expect(await screen.findByText("Insira seu primeiro nome.")).toBeInTheDocument();
        expect(await screen.findByText("Insira seu e-mail.")).toBeInTheDocument();
	});
});
