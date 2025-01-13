import logo from "../assets/logo.jpg"

export default function Header() {
    return (
      <header>
          <img src={logo} alt="Meal logo" style={{width: "200px", height: "200px", objectFit: "cover", borderRadius: "20%"}} />
          <h1>Meal Planning App</h1>
          <p>Best online tool for creating online library of your recipes.</p>
      </header>
    );
}
