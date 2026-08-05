import BaseApiService from "../api/BaseApiService";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

class UserService extends BaseApiService {
  getUsers() {
    return this.get<User[]>("/users");
  }

  getUser(id: string) {
    return this.get<User>(`/users/${id}`);
  }

  searchUsers(search: string, page: number) {
    return this.get<User[]>("/users", {
      params: {
        search,

        page,
      },
    });
  }

  createUser(user: User) {
    return this.post<User>("/users", user);
  }

  updateUser(id: string, user: User) {
    return this.put<User>(`/users/${id}`, user);
  }

  deleteUser(id: string) {
    return this.delete<void>(`/users/${id}`);
  }
}

export default new UserService();
