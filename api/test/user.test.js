const axios = require("axios");

it("should return msg: ok doing requisition to the / main route", () => {
    return axios.get("http://localhost:4000/").then(res => {
        expect(res.status).toEqual(200);
        expect(res.data.msg).toEqual("ok");
    });
});


it("should return status 200 and msg registered when do the request", () => {
    return axios.post("http://localhost:4000/user/register", {
        email: "pablo.barros1@outlook.com",
        name: 'Pablo Barros',
        password: 'umburana2011'
    }).then(res => {
        console.log(res.data);
        expect(res.status).toEqual(200);
        expect(res.data.msg).toEqual("success");
    })
})