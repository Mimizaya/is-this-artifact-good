import './App.css';

export default function App() {


  caches.keys().then(function(names) {
      for (let name of names)
          caches.delete(name);
  });

  return (
    <div>
      <img src="./images/icon.webp" />
      <div id="text">
        <h1>We have moved
        <br/>
        <a href="https://www.crimsonwitch.com"><span className="link-sub">https://www.</span>crimsonwitch.com</a>
        </h1>
      </div>
    </div>
  );
};