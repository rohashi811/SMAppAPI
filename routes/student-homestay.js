var express = require('express');
var router = express.Router();

const {
    StudentHomestay, Student, Homestay
} = require('../sequelize/models');

router.get('/', async(req, res, next) => {
    try {
        const studentHomestays = await StudentHomestay.findAll({
            include: [
                { model: Student },
                { model: Homestay }
            ]
        });
        res.json(studentHomestays);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const studentHomestay = await StudentHomestay.findByPk(id, {
            include: [
                { model: Student },
                { model: Homestay }
            ]
        });

        if (!studentHomestay) {
            return res.status(404).json({ message: 'Student Homestay not found' });
        }

        const result = {
            id: studentHomestay.id,
            studentId: studentHomestay.student_id,
            homestayId: studentHomestay.homestay_id,
            startDate: studentHomestay.start_date,
            endDate: studentHomestay.end_date,
            status: studentHomestay.status,

            // flatten related records as desired:
            student: {
                id: studentHomestay.Student.id,
                firstName: studentHomestay.Student.first_name,
                lastName: studentHomestay.Student.last_name
            },
            homestay: {
                id: studentHomestay.Homestay.id,
                firstName: studentHomestay.Homestay.first_name,
                lastName: studentHomestay.Homestay.last_name
            }
        };

        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/', async(req, res, next) => {
    try {   
        const { student_id, homestay_id, start_date, end_date, status } = req.body;

        const studentHomestay = await StudentHomestay.create({
            student_id,
            homestay_id,
            start_date,
            end_date: end_date ?? null,
        });

        const created = await StudentHomestay.findByPk(studentHomestay.id, {
            include: [
                { model: Student },
                { model: Homestay }
            ]
        });
        res.status(201).json(created);
    }
    catch (err) {
        next(err);
    }
});

router.put('/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const { student_id, homestay_id, start_date, end_date } = req.body;

        const studentHomestay = await StudentHomestay.findByPk(id);
        if (!studentHomestay) {
            return res.status(404).json({ message: 'Student Homestay not found' });
        }

        await studentHomestay.update({
            student_id,
            homestay_id,
            start_date,
            end_date: end_date ?? null
        });

        const updated = await StudentHomestay.findByPk(id, {
            include: [
                { model: Student },
                { model: Homestay }
            ]
        });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const studentHomestay = await StudentHomestay.findByPk(id);
        if (!studentHomestay) {
            return res.status(404).json({ message: 'Student Homestay not found' });
        }

        await studentHomestay.destroy();
        res.status(204).json({ message: 'Student Homestay deleted successfully' }).end();
    } catch (err) {
        next(err);
    }
});


module.exports = router;