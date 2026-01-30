import { Request, Response } from 'express';
import { PaginationUtil } from '../utils/pagination';
import userService from '../services/user.service';
import { ResponseUtil } from '../utils/response';

class UserController {
  async getUsers(req: Request, res: Response) {
    const options = PaginationUtil.getPaginationOptions(req.query);
    const result = await userService.getUsers(options);

    res
      .status(200)
      .json(
        ResponseUtil.paginated(
          result.data,
          result.meta.page,
          result.meta.limit,
          result.meta.total,
          'Users retrieved successfully'
        )
      );
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(ResponseUtil.success(user, 'User retrieved successfully'));
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(ResponseUtil.success(user, 'User updated successfully'));
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(200).json(ResponseUtil.success(null, 'User deleted successfully'));
  }
}

export default new UserController();
