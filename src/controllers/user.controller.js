import {User} from '../models/index.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function addUser(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'A valid user object is required.' });
  }

  try {
    const { fullName, email, phoneNumber, password, address, gender } = req.body;
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      address,
      gender,
    });
    const { password: _password, ...userData } = user.toJSON();

    res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ message: 'A valid user ID is required.' });
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'A valid user object is required.' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const editableFields = ['fullName', 'email', 'phoneNumber', 'password', 'address', 'gender'];
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]]),
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No editable user fields provided.' });
    }

    await user.update(updates);
    const { password: _password, ...userData } = user.toJSON();

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ message: 'A valid user ID is required.' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}