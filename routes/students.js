var express = require('express');
var router = express.Router();

const { 
    School, Agency, Group,
    Student, StudentDetail
} = require('../sequelize/models');

router.get('/student', async(req, res, next) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        next(err);
    }
});

router.get('/student/id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const student = await Student.findByPk(id, {
            include: [
                { model: School,        as: 'school'  },
                { model: Agency,        as: 'agency'  },
                { model: StudentDetail, as: 'detail'  },
                { model: Group,         as: 'groups', through: { attributes: [] } }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const result = {
            id:           student.id,
            firstName:    student.first_name,
            lastName:     student.last_name,
            arrivalDate:  student.arrival_date,
            leavingDate:  student.leaving_date,
            duration:     student.duration_of_stay,
            gender:       student.gender,

            // flatten related records as desired:
            school: student.school 
                ? { 
                    id: student.school.id, 
                    name: student.school.name 
                } : null,
            agency: student.agency 
                ? { 
                    id: student.agency.id, 
                    name: student.agency.name 
                } : null,
            detail: student.detail
                ? {
                    jpName:         student.detail.jp_name ?? null,
                    dateOfBirth:    student.detail.date_of_birth ?? null,
                    phone:          student.detail.phone_number ?? null,
                    email:          student.detail.email ?? null,
                    flight:         student.detail.flight_number ?? null,
                    arrival_time:   student.detail.arrival_time ?? null,
                    visa:           student.detail.visa ?? null,
                    allegies:       student.detail.allegies,
                    smoke:          student.detail.smoke,
                    pet:            student.detail.pet,
                    kid:            student.detail.kid,
                    meal:           student.detail.meal ?? null,
                    note:           student.detail.note ?? null,
                } : null,
            groups: student.group
                ? { 
                    id: student.group.id,
                    name: student.group.name,
                } : null,

        };
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/student', async(req, res, next) => {

});

router.put('/student/id', async(req, res, next) => {

});

router.delete('/student/id', async(req, res, next) => {

});