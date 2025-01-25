import { getAktivitasTerbaruFromDB } from '../models/aktivitasModel.js';

export const getAktivitasTerbaru = async (req, res) => {
  try {
    const aktivitasTerbaru = await getAktivitasTerbaruFromDB();
    res.json({ activities: aktivitasTerbaru });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).send('Server Error');
  }
};
