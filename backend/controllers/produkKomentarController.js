import * as produkKomentarModel from "../models/produkKomentarModel.js";

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { produk_id, pengguna_id, konten } = req.body;

        // Validasi jika semua field yang dibutuhkan ada
        if (!produk_id || !pengguna_id || !konten) {
            return res.status(400).json({ message: 'Field yang diperlukan belum lengkap' });
        }

        // Tambahkan komentar menggunakan method addKomentar dari model
        const newCommentId = await produkKomentarModel.addKomentar(produk_id, pengguna_id, konten);

        // Response sukses dengan ID komentar yang baru
        res.status(201).json({ message: 'Komentar berhasil dibuat', commentId: newCommentId });
    } catch (error) {
        console.error(error); // Log error untuk memudahkan debugging
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat komentar' });
    }
};

// Get all comments for a product
export const getAllComments = async (req, res) => {
    try {
        const { produk_id } = req.params;

        // Get all comments using the getAllKomentar method from model
        const comments = await produkKomentarModel.getAllKomentar(produk_id);

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil komentar' });
    }
};

// Count comments for a product
export const countComments = async (req, res) => {
    try {
        const { produk_id } = req.params;

        // Get the count using the getJumlahKomentar method from model
        const count = await produkKomentarModel.getJumlahKomentar(produk_id);

        res.status(200).json({ total_comments: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghitung komentar' });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { konten } = req.body;

        // Update the comment using the updateKomentar method from model
        const updatedComment = await produkKomentarModel.updateKomentar(id, konten);

        res.status(200).json({ message: 'Komentar berhasil diperbarui', updatedComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui komentar' });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the comment using the deleteKomentar method from model
        const isDeleted = await produkKomentarModel.deleteKomentar(id);
        if (!isDeleted) {
            return res.status(404).json({ message: 'Komentar tidak ditemukan' });
        }

        res.status(200).json({ message: 'Komentar berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus komentar' });
    }
};
