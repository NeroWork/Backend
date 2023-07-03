const log = async (level) => {
    const resp = await fetch(`http://localhost:8080/logger/${level}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}