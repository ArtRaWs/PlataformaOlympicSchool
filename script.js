// ==========================================
// FUNÇÕES AUXILIARES GLOBAIS
// ==========================================
const openModal = (modal) => modal && modal.classList.add("active")
const closeModal = (modal) => modal && modal.classList.remove("active")


// ==========================================
// VARIÁVEIS GLOBAIS (Modais)
// ==========================================
const loginModal = document.getElementById("loginModal")
const accountTypeModal = document.getElementById("accountTypeModal")
const signupModal = document.getElementById("signupModal")

// NOVOS MODAIS DO FLUXO DE PROFESSOR/PAGAMENTO
const planModal = document.getElementById('planModal');
const paymentMethodModal = document.getElementById('paymentMethodModal');
const cardDetailsModal = document.getElementById('cardDetailsModal');


// ==========================================
// LÓGICA DO MENU
// ==========================================
const navToggle = document.getElementById("navToggle")
const menu = document.getElementById("menu")

if (navToggle && menu) {
    navToggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open")
        navToggle.setAttribute("aria-expanded", isOpen)
        document.body.classList.toggle("menu-open", isOpen)
    })

    // Fechar menu ao clicar em um link
    const navLinks = menu.querySelectorAll("a")
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("open")
            navToggle.setAttribute("aria-expanded", "false")
            document.body.classList.remove("menu-open")
        })
    })
}



// ==========================================
// CONTROLE DE ABERTURA E FECHAMENTO DE MODAIS (Geral)
// ==========================================

// Botões para abrir modais
const btnLogin = document.getElementById("btnLogin")
const btnHeroLogin = document.getElementById("btnHeroLogin")
const btnSignup = document.getElementById("btnSignup")
const btnHeroSignup = document.getElementById("btnHeroSignup")

// Botões para fechar modais
const closeLogin = document.getElementById("closeLogin")
const closeAccountType = document.getElementById("closeAccountType")
const closeSignup = document.getElementById("closeSignup")

// Links entre modais
const linkToSignup = document.getElementById("linkToSignup")
const linkToLogin = document.getElementById("linkToLogin")

// Abrir modal de login
if (btnLogin) btnLogin.addEventListener("click", () => openModal(loginModal))
if (btnHeroLogin) btnHeroLogin.addEventListener("click", () => openModal(loginModal))

// Abrir modal de tipo de conta
if (btnSignup) btnSignup.addEventListener("click", () => openModal(accountTypeModal))
if (btnHeroSignup) btnHeroSignup.addEventListener("click", () => openModal(accountTypeModal))

// Fechar modais
if (closeLogin) closeLogin.addEventListener("click", () => closeModal(loginModal))
if (closeAccountType) closeAccountType.addEventListener("click", () => closeModal(accountTypeModal))
if (closeSignup) closeSignup.addEventListener("click", () => closeModal(signupModal))

// Fechar modal ao clicar fora
window.addEventListener("click", (e) => {
    if (e.target === loginModal) closeModal(loginModal)
    if (e.target === accountTypeModal) closeModal(accountTypeModal)
    if (e.target === signupModal) closeModal(signupModal)
})

// Navegar entre modais
if (linkToSignup) {
    linkToSignup.addEventListener("click", (e) => {
        e.preventDefault()
        closeModal(loginModal)
        openModal(accountTypeModal)
    })
}

if (linkToLogin) {
    linkToLogin.addEventListener("click", (e) => {
        e.preventDefault()
        closeModal(signupModal)
        openModal(loginModal)
    })
}

// ==========================================
// SELEÇÃO DE TIPO DE CONTA (Aluno vs Professor)
// ==========================================
const accountTypeBtns = document.querySelectorAll(".account-type-btn")

accountTypeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const type = btn.getAttribute('data-type') || 'aluno'
        
        // Salva o tipo temporariamente
        localStorage.setItem('tempUserRole', type === 'categoria' ? 'professor' : 'aluno')

        // Fecha o modal de seleção de tipo
        closeModal(accountTypeModal)

        // Ambos os fluxos (Aluno e Professor) vão para o Cadastro (Signup) primeiro
        // para coletar os dados iniciais.
        openModal(signupModal)
    })
})


// ==========================================
// CADASTRO (SIGNUP) E REDIRECIONAMENTO PARA PAGAMENTO
// ==========================================
const signupForm = document.querySelector('#signupModal .modal-form')
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        // 1. Lógica de Cadastro e armazenamento 
        const name = document.getElementById('signup-name')?.value?.trim() || 'Usuário'
        const email = document.getElementById('signup-email')?.value?.trim() || ''
        const estado = document.getElementById('signup-estado')?.value?.trim() || ''
        const telefone = document.getElementById('signup-telefone')?.value?.trim() || ''
        
        localStorage.setItem('userName', name)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userEstado', estado)
        localStorage.setItem('userTelefone', telefone)
        // Usa o role temporário para o próximo passo
        localStorage.setItem('userRole', localStorage.getItem('tempUserRole') || 'aluno') 
        
        const seed = encodeURIComponent(name.split(' ')[0] || 'User')
        localStorage.setItem('userAvatarUrl', `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`)
        
        // 2. Fechar Cadastro
        closeModal(signupModal)

        // 3. **NOVO COMPORTAMENTO:** Ir para o primeiro modal de Planos/Pagamento
        openModal(planModal)
    })
}


// ==========================================
// CONTROLE DO FLUXO DE PAGAMENTO (Planos, Forma, Cartão)
// ==========================================

// --- Lógica de fechar os novos modais ---
const closePlan = document.getElementById("closePlan");
const closePaymentMethod = document.getElementById("closePaymentMethod");
const closeCardDetails = document.getElementById("closeCardDetails");

if (closePlan) closePlan.addEventListener("click", () => closeModal(planModal));
if (closePaymentMethod) closePaymentMethod.addEventListener("click", () => closeModal(paymentMethodModal));
if (closeCardDetails) closeCardDetails.addEventListener("click", () => closeModal(cardDetailsModal));

// Fechar ao clicar fora (Overlay) para os novos modais
window.addEventListener("click", (e) => {
    if (e.target === planModal) closeModal(planModal);
    if (e.target === paymentMethodModal) closeModal(paymentMethodModal);
    if (e.target === cardDetailsModal) closeModal(cardDetailsModal);
});


// 1. Do Plano para a Forma de Pagamento
const btnPlanNext = document.getElementById('btnPlanNext');
if(btnPlanNext) {
    btnPlanNext.addEventListener('click', () => {
        closeModal(planModal);
        openModal(paymentMethodModal);
    });
}

// 2. Da Forma de Pagamento para o Cartão
const btnPayCard = document.getElementById('btnPayCard');
if(btnPayCard) {
    btnPayCard.addEventListener('click', () => {
        closeModal(paymentMethodModal);
        openModal(cardDetailsModal);
    });
}

// Botões Pix e Boleto (Apenas fecham por enquanto ou mostrariam outra tela)
const btnPayPix = document.getElementById('btnPayPix');
const btnPayBoleto = document.getElementById('btnPayBoleto');

if(btnPayPix) btnPayPix.addEventListener('click', () => {
    alert('Fluxo de Pix selecionado. Após a confirmação do pagamento, você será redirecionado para o login.');
    closeModal(paymentMethodModal);
    openModal(loginModal); // Vai para o login após simular pagamento
});
if(btnPayBoleto) btnPayBoleto.addEventListener('click', () => {
    alert('Boleto gerado. Após a compensação, você será redirecionado para o site.');
    closeModal(paymentMethodModal);
     window.location.href = 'inicio.html'
});


// 3. Submissão do Formulário de Cartão (Finalização)
const cardForm = document.querySelector('.card-form');
if(cardForm) {
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = cardForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = "Processando...";
        btn.disabled = true;

        setTimeout(() => {
            alert("Pagamento confirmado com sucesso!");
            closeModal(cardDetailsModal);
            window.location.href = 'inicio.html' // vai para o inicio!
            
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
}


// ==========================================
// CARROSSEL DE DEPOIMENTOS
// ==========================================
const testimonialTrack = document.getElementById("testimonialTrack")
const btnPrev = document.getElementById("btnPrev")
const btnNext = document.getElementById("btnNext")

let currentIndex = 0
const totalTestimonials = 3

function updateCarousel() {
    const translateX = -currentIndex * (100 / totalTestimonials)
    if(testimonialTrack) {
        testimonialTrack.style.transform = `translateX(${translateX}%)`
    }
}

if(btnNext) {
    btnNext.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalTestimonials
        updateCarousel()
    })
}

if(btnPrev) {
    btnPrev.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials
        updateCarousel()
    })
}


// ==========================================
// LÓGICA DO LOGIN FAKE
// ==========================================
const loginForm = document.querySelector("#loginModal .modal-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            alert("Preencha todos os campos.");
            return;
        }

        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("showWelcomeModal", "true");
        // O papel (role) já deve estar salvo em localStorage do signup
        
        window.location.href = 'inicio.html'
    });
}
