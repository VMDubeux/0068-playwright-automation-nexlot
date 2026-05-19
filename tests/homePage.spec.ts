import { expect, type Page } from '@playwright/test';

class HomePage {
    startNowButton = "Start Now Button";
    cancelButton = "Cancel Button";
    headerText = "Header Text";
    page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    selectorsList() {
        return {
            [this.startNowButton]: "button.btn-primary",
            [this.cancelButton]: "button.checkout-cancel-btn",
            [this.headerText]: "Assinar NexLot",
        };
    }

    async runPaymentOptionsTest() {
        const selectors = this.selectorsList();
        await this.page.goto("/"); 

        const startButtons = this.page.locator(selectors[this.startNowButton]);
        const count = await startButtons.count();

        for (let i = 0; i < count; i++) {
            // Clica no botão (seja ele de scroll ou de navegação)
            await startButtons.nth(i).click();

            // LÓGICA DE FILTRO: 
            // Índices 0, 1, 2*, 3* 4, 5*, 6* e 8 (1º, 2º, 3º, 4º, 5º, 6º, 7º e 9° botões) apenas scrollam.
            // Atualmente, apenas o 7 leva para o checkout/payment.
            // *Mudaram comportamento
            const isPaymentButton = ![0, 1, 2, 3, 4, 5, 6, 8].includes(i);

            if (isPaymentButton) {
                // Cria variável relacionada à página de checkout
                const newPage = await this.page.context().waitForEvent('page');
                // Aguarda a página de checkout carregar
                await newPage.waitForLoadState();
                // Verifica se a URL da nova página é a de checkout
                await expect(newPage).toHaveURL(/checkout/);
                // Fecha a página de checkout
                await newPage.close();
                // Verifica se está na home page após fechar a página de checkout
                await startButtons.nth(i).isVisible(); 
            }
        }
    }
}

export default HomePage;