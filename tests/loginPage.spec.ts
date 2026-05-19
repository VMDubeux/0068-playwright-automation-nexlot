import { expect, type Page } from '@playwright/test';

class LoginPage {
    // Definição das chaves dos seletores
    alreadyHasAccountButton = "Has Account Button";
    emailInput = "Email Login Input";
    passwordInput = "Password Login Input";
    errorMessage = "Error Message";
    hamburguerButton = "Hamburguer Button";
    logoutButton = "Logout Button";
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Centralização dos seletores para fácil manutenção
    selectorsList() {
        return {
            [this.alreadyHasAccountButton]: "button.btn-ghost-login",
            [this.emailInput]: "#login-email",
            [this.passwordInput]: "#login-password",
            [this.errorMessage]: "#login-error",
            [this.hamburguerButton]: "button.hamburger-btn",
            [this.logoutButton]: "button.logout-btn",
        };
    }

    async runLoginTest(userEmail: any, userPassword: any, enterWithKeyboard: boolean) {
        const selectors = this.selectorsList();

        // 1. Navegação e Preparação
        await this.page.goto("baseUrl");
        await this.page.locator(selectors[this.alreadyHasAccountButton]).click();
        await expect(this.page).toHaveURL(/login/);

        // 2. Preenchimento de Credenciais
        await this.page.locator(selectors[this.emailInput]).fill(userEmail);
        await this.page.locator(selectors[this.passwordInput]).fill(userPassword);

        // 3. Submissão do Formulário
        if (enterWithKeyboard) {
            await this.page.keyboard.press("Enter");
        } else {
            await this.page.locator("button#login-btn").click();
        }

        const errorLocator = this.page.locator(selectors[this.errorMessage]);

        try {
            /* 
               4. Validação do Erro:
               Espera-se que o elemento fique visível e que o texto não seja vazio.
            */
            await errorLocator.waitFor({ state: 'visible', timeout: 2000 });
            
            // Validar que o texto foi realmente renderizado
            await expect(errorLocator).not.toBeEmpty(); 
            await expect(errorLocator).toBeVisible();
        } catch (error) {

            //5. Fluxo de Sucesso (Executado se o erro não aparecer/estiver vazio):
            await expect(this.page).toHaveURL(/home/);
            
            // Interação com o Menu
            const menuBtn = this.page.locator(selectors[this.hamburguerButton]);
            await menuBtn.waitFor({ state: 'visible' });
            await menuBtn.click();
            
            // Logout
            const logoutBtn = this.page.locator(selectors[this.logoutButton]).first();
            await logoutBtn.waitFor({ state: 'visible' });
            await logoutBtn.click();
        }
    }
}

export default LoginPage;