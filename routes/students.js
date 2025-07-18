var express = require('express');
var router = express.Router();

const { 
    School, Agency, Group,
    Student, StudentDetail
} = require('../sequelize/models');

router.get('/', async(req, res, next) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const student = await Student.findByPk(id, {
            include: [
                { model: School  },
                { model: Agency  },
                { model: StudentDetail  },
                { model: Group }
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
            detail:  {
                    jp_name:         student.StudentDetail.jp_name ?? null,
                    dateOfBirth:    student.StudentDetail.date_of_birth ?? null,
                    phone:          student.StudentDetail.phone_number ?? null,
                    email:          student.StudentDetail.email ?? null,
                    flight:         student.StudentDetail.flight_number ?? null,
                    arrival_time:   student.StudentDetail.arrival_time ?? null,
                    visa:           student.StudentDetail.visa ?? null,
                    allegies:       student.StudentDetail.allegies,
                    smoke:          student.StudentDetail.smoke,
                    pet:            student.StudentDetail.pet,
                    kid:            student.StudentDetail.kid,
                    meal:           student.StudentDetail.meal ?? null,
                    note:           student.StudentDetail.note ?? null,
                },
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

router.post('/', async(req, res, next) => {
    try {
        const { 
            firstName, lastName, arrivalDate, leavingDate, gender, schoolId, agencyId,
            duration, jpName, dateOfBirth, phone, email, flight, arrivalTime, visa,allegies, smoke, pet, kid, meal, note, groupId
        } = req.body;  
        
        const student = await Student.create({
            first_name: firstName,
            last_name: lastName,
            arrival_date: arrivalDate,
            leaving_date: leavingDate ?? null,
            gender: gender,
            school_id: schoolId ?? null,
            agency_id: agencyId ?? null,
            group_id: groupId ?? null,
        }, { returning: true });

        await StudentDetail.create({
            student_id: student.id,
            jp_name: jpName ?? null,
            date_of_birth: dateOfBirth ?? null,
            phone_number: phone ?? null,
            email: email ?? null,
            flight_number: flight ?? null,
            arrival_time: arrivalTime ?? null,
            visa: visa ?? null,
            allegies: allegies ?? null,
            smoke: smoke,
            pet: pet,
            kid: kid,
            meal: meal ?? null,
            note: note ?? null,
        }, { returning: true });

        const created = await Student.findByPk(student.id, {
            include: [{ model: StudentDetail }]
        });
        res.json(created);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            firstName, lastName, arrivalDate, leavingDate, gender, schoolId, agencyId,
            jpName, dateOfBirth, phone, email, flight, arrivalTime, visa,allegies, smoke, pet, kid, meal, note, groupId
        } = req.body; 

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.update({ firstName, lastName, arrivalDate, leavingDate, gender, agencyId, schoolId, groupId });

        const existingDetail = await StudentDetail.findOne({ where: { student_id: id } });
        if (existingDetail) {
            await existingDetail.update({ jpName, dateOfBirth, phone, email, flight, arrivalTime, visa,allegies, smoke, pet, kid, meal, note });
        } else {
            await StudentDetail.create({
                student_id: student.id,
                jp_name: jpName ?? null,
                date_of_birth: dateOfBirth ?? null,
                phone_number: phone ?? null,
                email: email ?? null,
                flight_number: flight ?? null,
                arrival_time: arrivalTime ?? null,
                visa: visa ?? null,
                allegies: allegies ?? null,
                smoke: smoke,
                pet: pet,
                kid: kid,
                meal: meal ?? null,
                note: note ?? null,
            }, { returning: true });
        }

        const updated = await Student.findByPk(id, {
            include: [{ model: StudentDetail }]
        });
        res.json(updated);

    } catch (err) {
        next(err);
    } 
});

router.delete('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.destroy();
        res.status(204).json({ message: 'Student deleted successfully' }).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;