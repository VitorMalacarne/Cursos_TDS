function CoursePage ({ course }) {
    return (
        <div className="cp-app">
          {/* Navigation Bar */}
          <header className="cp-header">
            <div className="cp-header-container">
              <a href="/" className="cp-logo">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem_2025-02-15_232821800-hSEJozf0LNiar59xZQfnuqhcjl9LyZ.png"
                  alt="Udemy"
                />
              </a>
              <button className="cp-nav-button">Explorar</button>
              <div className="cp-search-container">
                <input type="search" placeholder="Pesquisar por qualquer coisa" className="cp-search-input" />
              </div>
              <button className="cp-nav-button">Udemy Business</button>
              <button className="cp-nav-button">Ensine na Udemy</button>
              <button className="cp-nav-button">Meu aprendizado</button>
              <button className="cp-icon-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className="cp-icon-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
              </button>
              <button className="cp-icon-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <button className="cp-profile-button">JD</button>
            </div>
          </header>
    
          {/* Main Content */}
          <main>
            <div className="cp-hero">
              <div className="cp-container">
                <nav className="cp-breadcrumb">
                  <ol>
                    <li>
                      <a href="#">Ensino e estudo acadêmico</a>
                    </li>
                    <li>›</li>
                    <li>
                      <a href="#">Aprendizagem de idiomas</a>
                    </li>
                    <li>›</li>
                    <li>
                      <a href="#">Inglês</a>
                    </li>
                  </ol>
                </nav>
    
                <div className="cp-course-grid">
                  <div className="cp-course-info">
                    <h1>Curso de Inglês Rápido: do Básico à Fluência Sem Enrolação</h1>
                    <p className="cp-course-description">
                      Curso de Inglês com aulas precisas e centenas de exercícios para dominar o inglês em pouco tempo.
                      Novas aulas todo mês!
                    </p>
    
                    <div className="cp-course-stats">
                      <span className="cp-badge">Mais vendidos</span>
                      <div className="cp-rating">
                        <span className="cp-rating-score">4,7</span>
                        <div className="cp-stars">★★★★★</div>
                        <a href="#" className="cp-rating-count">
                          (9.189 classificações)
                        </a>
                      </div>
                      <span className="cp-students">46.582 alunos</span>
                    </div>
    
                    <div className="cp-course-meta">
                      <p>
                        Criado por <a href="#">Paulo Andrade, Ph.D. +1460.000 Alunos</a>, <a href="#">Marcus A.</a>
                      </p>
                      <div className="cp-meta-info">
                        <span>Última atualização em 02/2025</span>
                        <span>Português</span>
                        <span>Português [Automático]</span>
                      </div>
                    </div>
                  </div>
    
                  <div className="cp-course-card">
                    <div className="cp-tabs">
                      <button className="cp-tab cp-active">Pessoal</button>
                      <button className="cp-tab">Equipes</button>
                    </div>
                    <div className="cp-card-content">
                      <h2>Assine os principais cursos da Udemy</h2>
                      <p>Adquira esse curso e mais 2.000 dos nossos principais cursos com o Plano Individual.</p>
                      <a href="#" className="cp-learn-more">
                        Saiba mais
                      </a>
                      <button className="cp-subscribe-button">Experimente o Plano Individual gratuitamente</button>
                      <p className="cp-price-info">A partir de R$ 33,33 por mês após o teste</p>
                      <p className="cp-cancel-info">Cancele quando quiser</p>
                      <div className="cp-divider">
                        <span>ou</span>
                      </div>
                      <div className="cp-price">
                        <span>R$ 189,90</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            <div className="cp-container">
              <section className="cp-learning-section">
                <h2>O que você aprenderá</h2>
                <div className="cp-learning-grid">
                  <div className="cp-learning-item">
                    <span className="cp-check">✓</span>
                    <p>
                      Mais de 10.000 palavras em Inglês (entre pronomes, verbos, preposições, adjetivos, substantivos,
                      expressões e muito mais) para acrescentar ao seu vocabulário
                    </p>
                  </div>
                  <div className="cp-learning-item">
                    <span className="cp-check">✓</span>
                    <p>
                      Aprenderá todo o conteúdo que você levaria anos para ter contato em um curso tradicional de Inglês.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      );
}

export default CoursePage;