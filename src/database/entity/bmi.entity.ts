import { ApiProperty } from '@nestjs/swagger';
import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { ReportDB } from './report.entity';
import { UserDB } from './user.entity';

@Table({
    tableName: 'bmi',
})
export class BmiDB extends Model<BmiDB> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: 'unique_bmi_id',
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @ApiProperty()
    @Column({
        type : DataType.DOUBLE,
        allowNull: false,
        comment: 'ผลรวมดัชนีมวลกาย',
    })
    bmiTotal: number;

    @CreatedAt
    readonly createdAt?: Date;

    @UpdatedAt
    readonly updatedAt?: Date;

    // ────────────────────────────────────────────────────────────────────────────────
    // @HasMany(() => ReportDB)
    // reportLists: ReportDB[];

    // @HasMany(() => UserDB)
    // userDBLists: UserDB[];
    // ────────────────────────────────────────────────────────────────────────────────

    @ForeignKey(() => UserDB)
    @Column({
        allowNull: true,
        type: DataType.UUID,
    })
    userId: string;

    @BelongsTo(() => UserDB)
    user: UserDB;
}
