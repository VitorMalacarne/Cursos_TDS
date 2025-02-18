import { useEffect, useState } from "react";
import "../css/TeacherMainPage.css";
import UserService from "../Services/UserService";

function TeacherMainPage () {
    const [isChecked, setIsChecked] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);

    const jwtToken = localStorage.getItem("authToken");

    useEffect(() => {
            if (jwtToken) {
                UserService.getUser()  // Certifique-se de que o método getUser() está implementado corretamente no seu UserService
                    .then((response) => {
                        const user = response.data; // O objeto de resposta geralmente está em `data`
                        if(user.role == "Teacher"){setIsTeacher(true)} // Atualiza o estado com o nome do usuário
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar dados do usuário", error);
                    });
            }
        }, [jwtToken]);
  
    const handleCheckboxChange = () => {
      setIsChecked(!isChecked)
    }

    const handleStartTeaching = () => {
        const updatedUser = { role: "Teacher" };
      
        UserService.update(updatedUser)
          .then(() => {
            setIsTeacher(true);
          })
          .catch((error) => {
            console.error("Erro ao atualizar o usuário:", error);
          });
      };
  
    return (
      <div className="terms-container">
        <main className="terms-content">
          <h1>Termos e Condições para Instrutores</h1>
          <div className="terms-scroll">
            <h2>1. Introdução</h2>
            <p>
              Bem-vindo à plataforma de ensino da LearnNest. Antes de começar a criar e publicar seus cursos, é importante que
              você leia e concorde com nossos termos e condições para instrutores.
            </p>
  
            <h2>2. Elegibilidade</h2>
            <p>
              Para se tornar um instrutor na LearnNest, você deve ter pelo menos 18 anos de idade e possuir expertise no
              assunto que deseja ensinar.
            </p>
  
            <h2>3. Conteúdo do Curso</h2>
            <p>
              3.1. Você é responsável por criar e manter seu próprio conteúdo de curso original.
              <br />
              3.2. O conteúdo não deve violar direitos autorais ou propriedade intelectual de terceiros.
              <br />
              3.3. A LearnNest se reserva o direito de remover qualquer conteúdo que viole nossas políticas.
            </p>
  
            <h2>4. Precificação e Pagamentos</h2>
            <p>
              4.1. Você pode definir o preço do seu curso dentro das faixas estabelecidas pela LearnNest.
              <br />
              4.2. A LearnNest retém uma porcentagem das vendas do curso conforme nosso acordo de receita compartilhada.
              <br />
              4.3. Os pagamentos são processados mensalmente, sujeitos a um valor mínimo de saque.
            </p>
  
            <h2>5. Promoções e Marketing</h2>
            <p>
              5.1. A LearnNest pode incluir seu curso em promoções para aumentar as vendas.
              <br />
              5.2. Você concorda em não oferecer seu curso LearnNest por um preço menor em outras plataformas.
            </p>
  
            <h2>6. Suporte aos Alunos</h2>
            <p>
              Você concorda em fornecer suporte adequado aos alunos, respondendo a perguntas e fornecendo atualizações ao
              curso quando necessário.
            </p>
  
            <h2>7. Rescisão</h2>
            <p>
              A LearnNest se reserva o direito de encerrar sua conta de instrutor se você violar estes termos ou nossas
              políticas da comunidade.
            </p>
  
            <h2>8. Alterações nos Termos</h2>
            <p>
              A LearnNest pode atualizar estes termos periodicamente. Continuando a usar a plataforma após as alterações, você
              concorda com os novos termos.
            </p>
          </div>
  
          <div className="terms-agreement">
            <label className="checkbox-container">
              <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
              <span className="checkmark"></span>
              Eu li e concordo com os Termos e Condições para Instrutores
            </label>
          </div>
  
          <button className="start-teaching-btn" disabled={!isChecked} onClick={handleStartTeaching}>
            Começar a ensinar
          </button>
        </main>
      </div>
    )
  }

  export default TeacherMainPage;
  