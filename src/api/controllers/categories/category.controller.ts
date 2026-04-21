import { Request, Response } from 'express';
import Category from '../../../core/models/category.model';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const cats = await Category.find().select('_id name').sort({ name: 1 });
    const result = cats.map(c => ({ id: c._id, name: c.name }));
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Hiba a kategóriák lekérésekor.' });
  }
};

export default getAllCategories;
