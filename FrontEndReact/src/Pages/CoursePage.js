function CoursePage({ course }) {
  return (
    <div className="cp-app">

      {/* Main Content */}
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
    </div>
  );
}

export default CoursePage;