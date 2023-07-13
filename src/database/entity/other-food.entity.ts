import { ApiProperty } from '@nestjs/swagger';
import { Table, Model, Column, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { FoodTypeDB } from './food-type.entity';
import { ReportDB } from './report.entity';

@Table({
    tableName: 'otherFood',
})
export class OtherFoodDB extends Model<OtherFoodDB> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: 'unique_alterFood_id',
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @ApiProperty()
    @Column({
        comment: 'ชื่ออาหาร',
    })
    otherName: string;

    @ApiProperty()
    @Column({
        comment: 'แคลอรี่อาหาร',
    })
    otherCalorie: number;
    // ─────────────────────────────────────────────────────────────────────

    @HasMany(() => ReportDB)
    reportLists: ReportDB[];

    @ForeignKey(() => FoodTypeDB)
    @Column({
        allowNull: false,
        unique: 'unique_food_type_id',
    })
    foodTypeId: number;

    @BelongsTo(() => FoodTypeDB)
    foodTypeList: FoodTypeDB;
    // ─────────────────────────────────────────────────────────────────────────────
}
