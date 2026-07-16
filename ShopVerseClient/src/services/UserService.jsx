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
    getAllCategories(data)
    {
        return api.get("/category/all",data)
    }
    getProductsByCategory(categorySlug) {
        return api.get(`/product/category/${categorySlug}`);
    }

}

export default new UserService();