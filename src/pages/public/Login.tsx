import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { colorAzul, colorBranco } from '../../values/colors';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const telaCadastrar = false;
  const telaLogin = true;
  // USE A TELA PADRÃO PARA INTERCALAR PARA TELA DE CADASTRO
  const telaPadral = telaLogin;

  const [isLogin, setIsLogin] = useState(telaPadral);
  const [email, setEmail] = useState('yuritakeo@ucl.br');
  const [senha, setSenha] = useState('123456');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');
  const [lembrar, setLembrar] = useState(true); // 🔥 NOVO

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !senha) {
      Swal.fire({
        icon: 'error',
        title: '🚨 Atenção!',
        text: 'Preencha todos os campos para continuar.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      // 🔥 DEFINIR SE O USUÁRIO FICA LOGADO OU NÃO
      await setPersistence(auth, lembrar ? browserLocalPersistence : browserSessionPersistence);

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);

        setUser({
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          displayName: userCredential.user.displayName,
        });

        navigate('/dashboard');
      } else {
        if (senha !== confirmarSenha) {
          Swal.fire({
            icon: 'error',
            title: '⚠️ Erro!',
            text: 'As senhas não coincidem.',
            confirmButtonText: 'OK',
          });
          return;
        }

        if (!nome) {
          Swal.fire({
            icon: 'error',
            title: '🚨 Nome obrigatório!',
            text: 'O nome não pode estar vazio.',
            confirmButtonText: 'OK',
          });
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const uid = userCredential.user.uid;

        setUser({
          email: userCredential.user.email,
          uid: uid,
          displayName: nome,
        });

        await setDoc(doc(db, 'clientes', uid), {
          nome,
          email,
          endereco: '',
        });

        Swal.fire({
          title: '🥳 Cadastro realizado!',
          text: `Seja bem-vindo(a), ${nome}!`,
          icon: 'success',
          confirmButtonText: 'Vamos lá!',
          timer: 3500,
          timerProgressBar: true,
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      let mensagem = 'Erro ao autenticar.';

      if (error.code === 'auth/email-already-in-use') mensagem = 'Este e-mail já está em uso.';
      if (error.code === 'auth/invalid-email') mensagem = 'E-mail inválido.';
      if (error.code === 'auth/weak-password') mensagem = 'Senha muito fraca.';
      if (error.code === 'auth/user-not-found') mensagem = 'Usuário não encontrado.';
      if (error.code === 'auth/wrong-password') mensagem = 'Senha incorreta.';

      Swal.fire({
        icon: 'error',
        title: '🚨 Ocorreu um erro!',
        text: mensagem,
        confirmButtonText: 'Tentar novamente',
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#EAF0F6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
      }}>
        <h2 style={{ color: colorAzul, marginBottom: '10px', textAlign: 'center' }}>
          {isLogin ? 'Entrar' : 'Criar conta'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className='mb-3'>
            <label className='form-label'>E-mail</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div className='mb-3'>
            <label className='form-label'>Senha</label>
            <input
              type='password'
              className='form-control'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* CONFIRMAR SENHA */}
          {!isLogin && (
            <>
              <div className='mb-3'>
                <label className='form-label'>Confirme sua senha</label>
                <input
                  type='password'
                  className='form-control'
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Seu nome</label>
                <input
                  type='text'
                  className='form-control'
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* 🔥 CHECKBOX LEMBRAR-ME */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={lembrar}
              onChange={() => setLembrar(!lembrar)}
              id="lembrarCheck"
            />
            <label className="form-check-label" htmlFor="lembrarCheck">
              Manter-me conectado
            </label>
          </div>

          <button
            type='submit'
            className='btn w-100'
            style={{
              backgroundColor: colorAzul,
              color: colorBranco,
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 'bold',
            }}
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
