import { Link } from "react-router-dom";
import '../../styles/pages/auth/landing.css'

export default function Landing() {
    return (
        <div className="landing-container">

            {/* Header */}
            <header className="landing-header">
                <h1 className="logo">Clínica Odontológica Luant</h1>
                <nav>
                    <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                </nav>
            </header>

            {/* Hero */}
            <section className="landing-hero">
                <div className="hero-text">
                    <h2>Sonrisas que transforman vidas</h2>
                    <p>
                        Brindamos atención odontológica moderna y personalizada 
                        con los mejores especialistas y tecnología avanzada.
                    </p>
                    <Link to="/login" className="btn-primary">Comenzar</Link>
                </div>

                <div className="hero-img">
                    <img src="https://i.pinimg.com/originals/c3/36/c0/c336c089fbf06e9f9fd8416960c1bd87.png" alt="Odontología" />
                </div>
            </section>

            {/* Sección "Quiénes somos" */}
            <section className="landing-info">
                <h3>¿Quiénes somos?</h3>
                <p>
                    Somos una clínica comprometida con tu salud bucal. 
                    Nuestro equipo combina experiencia profesional con un trato humano y cercano. 
                    Trabajamos para devolverte la confianza a través de una sonrisa saludable.
                </p>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>© 2025 Clínica Dental Luant — Todos los derechos reservados</p>
            </footer>
        </div>
    );
}
