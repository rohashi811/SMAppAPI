var express = require('express');
var router = express.Router();

const {
    Homestay, HomestayDetail,
    HomestayFamily
} = require('../sequelize/models');

router.get('/', async(req, res, next) => {
    try {
        const homestays = await Homestay.findAll();
        res.json(homestays);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const homestay = await Homestay.findByPk(id, {
            include: [
                { model: HomestayDetail }
            ]
        });

        if (!homestay) {
            return res.status(404).json({ message: 'Homestay not found' });
        }

        const result = {
            id: homestay.id,
            firstName:    homestay.first_name,
            lastName:     homestay.last_name,
            phone: homestay.phone,
            address: homestay.address,
            detail: {
                email: homestay.HomestayDetail.email ?? null,
                numOfRoom: homestay.HomestayDetail.num_of_room ?? null,
                housemates: homestay.HomestayDetail.housemates ?? null,
                pet: homestay.HomestayDetail.pet
            }
        };

        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/', async(req, res, next) => {
    try {   
        const { first_name, last_name, phone, address, email, num_of_room, housemates, pet } = req.body;

        const homestay = await Homestay.create({
            first_name,
            last_name,
            phone,
            address
        });

        await HomestayDetail.create({
            homestay_id: homestay.id,
            email: email ?? null,
            num_of_room: num_of_room ?? null,
            housemates: housemates ?? null,
            pet
        });

        const created = await Homestay.findByPk(homestay.id, {
            include: [{ model: HomestayDetail }]
        });
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }   
});

router.put('/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const { first_name, last_name, phone, address, email, num_of_room, housemates, pet } = req.body;

        const homestay = await Homestay.findByPk(id);
        if (!homestay) {
            return res.status(404).json({ message: 'Homestay not found' });
        }

        await homestay.update({
            first_name,
            last_name,
            phone,
            address
        });

        const existingDetail = await HomestayDetail.findOne({ where: { homestay_id: id } });
        if (detail) {
            await existingDetail.update({
                email: email ?? null,
                num_of_room: num_of_room ?? null,
                housemates: housemates ?? null,
                pet
            });
        } else {
            await HomestayDetail.create({
                homestay_id: id,
                email: email ?? null,
                num_of_room: num_of_room ?? null,
                housemates: housemates ?? null,
                pet
            });
        }

        const updated = await Homestay.findByPk(id, {
            include: [{ model: HomestayDetail }]
        });
        res.json(updated);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const homestay = await Homestay.findByPk(id);
        if (!homestay) {
            return res.status(404).json({ message: 'Homestay not found' });
        }

        await homestay.destroy();
        res.status(204).json({ message: 'Homestay deleted successfully' }).end();
    } catch (err) { 
        next(err);
    }   
});

router.get('/family/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const familyMembers = await HomestayFamily.findAll({ where: { homestay_id: id } });

        if (!familyMembers.length) {
            return res.status(404).json({ message: 'No family members found for this homestay' });
        }

        res.json(familyMembers);
    } catch (err) {
        next(err);
    }
});

router.post('/family/:id', async(req, res, next) => {
    try {   
        const { id } = req.params;
        const { name, relationship, phone, date_of_birth } = req.body;

        const familyMember = await HomestayFamily.create({
            homestay_id: id,
            name,
            relationship,
            phone: phone ?? null,
            date_of_birth: date_of_birth ?? null
        });

        res.status(201).json(familyMember);
    } catch (err) {
        next(err);
    }  
});

router.put('/family/:id/:memberId', async(req, res, next) => {
    try {   
        const { id, memberId } = req.params;
        const { name, relationship, phone, date_of_birth } = req.body;

        const familyMember = await HomestayFamily.findByPk(memberId);
        if (!familyMember || familyMember.homestay_id !== parseInt(id)) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        await familyMember.update({
            name,
            relationship,
            phone: phone ?? null,
            date_of_birth: date_of_birth ?? null
        });

        res.json(familyMember);
    } catch (err) {
        next(err);
    }
});

router.delete('/family/:id/:memberId', async(req, res, next) => {
    try {   
        const { id, memberId } = req.params;
        const familyMember = await HomestayFamily.findByPk(memberId);
        if (!familyMember || familyMember.homestay_id !== parseInt(id)) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        await familyMember.destroy();
        res.status(204).json({ message: 'Family member deleted successfully' }).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;