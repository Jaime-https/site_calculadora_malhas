# ⚡ Calculadora de Malhas - Futurista

> Esta é uma aplicação web para resolução de circuitos elétricos (Método das Malhas) que prioriza a Experiência do Usuário (UX).
 O projeto foi desenvolvido com foco em acessibilidade e neurodiversidade, implementando recursos como dark mode automático, 
 ajustes para sensibilidade à luz, fontes adaptadas para dislexia e elementos visuais amigáveis para pessoas com TDAH, criando um ambiente de estudo focado e acolhedor.

![Badge em Desenvolvimento](https://img.shields.io/badge/STATUS-CONCLUÍDO-brightgreen)
![Python](https://img.shields.io/badge/Backend-Python%20%7C%20Flask-blue)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-orange)

## 📖 Sobre o Projeto

Este projeto é uma ferramenta avançada para resolução de sistemas de malhas em circuitos elétricos (DC) utilizando o **Método da Inspeção**. Diferente de calculadoras comuns, esta aplicação foi desenvolvida com foco total na **Experiência do Usuário (UX)** e **Acessibilidade**.

O sistema monta automaticamente a matriz de resistências $[R]$ e o vetor de tensões $[V]$, resolve o sistema linear $[R] \cdot [I] = [V]$ e apresenta os resultados com gráficos, tabelas de potência e explicações didáticas passo a passo.

---

## ✨ Funcionalidades Principais

### 🧠 Engenharia & Matemática
* **Resolução Dinâmica:** Suporta $N$ malhas (limitado apenas pela memória do dispositivo).
* **Método da Inspeção:** Montagem automática da matriz de impedâncias próprias e mútuas.
* **Explicação Passo a Passo:** O sistema "escreve" como chegou à equação de cada malha, servindo como ferramenta de estudo.
* **Análise de Potência:** Tabela de balanço energético (Potência Gerada vs. Dissipada).
* **Visualização de Dados:** Gráficos de barras (via Chart.js) comparando as correntes.

### 🎨 Interface & Design (High-End)
* **Temas Visuais:**
    * 🔵 **Neon Gélido (Padrão):** Alto contraste e tons cianos.
    * 🟢 **Gamer:** Estilo Matrix/Terminal verde.
    * 🌸 **Pink Protocol:** Estética suave e tons pastéis.
    * ⚫ **Nier Grey:** Monocromático e elegante.
* **Mascotes Interativos:** Personagens 2D flutuantes que reagem à troca de temas (Toggle On/Off).
* **Efeitos Visuais:** Glassmorphism (vidro fosco), gradientes neon e animações suaves (`popIn`).

### ♿ Acessibilidade & Conforto
* **Player Lo-Fi Integrado:** Rádio online com estações focadas em concentração (Lofi Girl, Chillhop, Synthwave).
* **Modo Daltonismo:** Filtros para Protanopia, Deuteranopia e Tritanopia.
* **Ajustes Manuais:** Controle total de Brilho, Contraste, Saturação e Tamanho da Fonte.
* **Fonte Dislexia:** Opção de fonte otimizada para facilitar a leitura (`OpenDyslexic`).

### 🚀 Produtividade
* **Biblioteca de Circuitos:** Carregamento instantâneo de templates clássicos:
    * Ponte de Wheatstone.
    * Rede Escada (Ladder Network).
    * Malhas Simples.
* **Exportação:** Botão de impressão otimizado para gerar relatórios em PDF limpos.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python 3, Flask (Microframework).
* **Frontend:** HTML5, CSS3 (Variáveis CSS, Flexbox, Grid), JavaScript (ES6+).
* **Bibliotecas:**
    * `Chart.js` (Gráficos).
    * `Google Fonts` (Inter).

---

## 📂 Estrutura do Projeto

```bash
malhas_site/
├── app.py                  # Servidor Flask
├── static/
│   ├── css/                # (Estilos inline no HTML para performance)
│   ├── img/                # Imagens das mascotes (2a.png, etc.)
│   └── js/
│       ├── main.js                 # Lógica de UI, Áudio e Controle
│       └── circuit_solver_engine.js # Motor matemático (Classes)
└── templates/
    └── index.html          # Interface principal