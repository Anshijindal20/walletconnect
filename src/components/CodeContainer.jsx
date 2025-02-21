const CodeContainer = ({ title, content }) => {
    return (
      <section className="code-container">
        <h2 className="code-container-title">{title}</h2>
        <div className="code-container-content">
          <pre>{JSON.stringify(content, null, 2)}</pre>
        </div>
      </section>
    );
  };
  
  export default CodeContainer;
  