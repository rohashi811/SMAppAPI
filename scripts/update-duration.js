const { Student } = require('../sequelize/models');

async function updateAllDurations() {
  try {
    console.log('Duration更新を開始します...');
    
    // 全ての学生を取得
    const students = await Student.findAll({
      where: {
        arrival_date: { [Student.sequelize.Op.ne]: null },
        leaving_date: { [Student.sequelize.Op.ne]: null }
      }
    });

    console.log(`${students.length}人の学生が見つかりました`);

    let updatedCount = 0;
    
    for (const student of students) {
      const calculatedDuration = Student.calculateDuration(student.arrival_date, student.leaving_date);
      
      if (calculatedDuration !== null && student.duration !== calculatedDuration) {
        await student.update({ duration: calculatedDuration });
        updatedCount++;
        console.log(`学生ID ${student.id}: ${student.duration}日 → ${calculatedDuration}日`);
      }
    }

    console.log(`更新完了: ${updatedCount}人の学生のdurationを更新しました`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    process.exit(0);
  }
}

// スクリプト実行
updateAllDurations(); 