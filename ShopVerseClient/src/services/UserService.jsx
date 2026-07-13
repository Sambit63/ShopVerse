import api from "./api";

class UserService {

    login(data) {
        return api.post("/user/login", data);
    }

    register(data) {
        return api.post("/user/register", data);
    }

    getProfile() {
        return api.get("/user/profile");
    }

    updateProfile(data) {
        return api.put("/user/profile", data);
    }

}

export default new UserService();