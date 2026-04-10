async function checkInput() {
    const input = document.getElementById("inputBox").value;

    const res = await fetch("http://localhost:3000/api/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
    });

    const data = await res.json();
    console.log(data);

    document.getElementById("result").innerText = 
    data.status + " | " + data.attackType + " | " + data.reason;
}