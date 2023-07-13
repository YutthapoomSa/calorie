import { ApiProperty } from '@nestjs/swagger';
import { Column, CreatedAt, DataType, HasMany, IsEmail, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { BmiDB } from './bmi.entity';
import { FoodDB } from './food.entity';
import { ReportDB } from './report.entity';
import { UserPasswordDB } from './user-password.entity';
import { UserSocketDB } from './user-socket.entity';

export enum UserDBRole {
    admin = 'admin',
    user = 'user',
}

export enum UserDBGender {
    male = 'male',
    female = 'female',
    other = 'other',
}

export enum UserDBtarget {
    male = '2000',
    female = '1600',
}

@Table({
    tableName: 'user',
})
export class UserDB extends Model<UserDB> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: 'unique_userId',
        primaryKey: true,
        defaultValue: () => uuidv4(),
    })
    id: string;

    @ApiProperty()
    @IsEmail
    @Column({
        allowNull: false,
        unique: 'unique_user_email',
    })
    email: string;

    @ApiProperty()
    @Column({
        allowNull: false,
        unique: 'unique_username',
    })
    username: string;

    @Column({
        allowNull: false,
    })
    password: string;

    @ApiProperty()
    @Column({
        allowNull: false,
    })
    firstName: string;

    @ApiProperty()
    @Column({
        allowNull: false,
    })
    lastName: string;

    @Column({
        allowNull: false,
        type: DataType.ENUM(UserDBRole.user, UserDBRole.admin),
        comment: 'สิทธิ์การเข้าใช้งาน',
        defaultValue: () => DataType.ENUM(UserDBRole.user),
    })
    role: UserDBRole;

    @ApiProperty()
    @Column({
        comment: 'status เปิด ปิด',
        defaultValue: true,
        allowNull: false,
    })
    status: boolean;

    // @ApiProperty()
    // @Column({
    //     allowNull: true,
    // })
    // image: string;

    @ApiProperty()
    @Column({
        allowNull: true,
        type: DataType.ENUM(UserDBGender.male, UserDBGender.female, UserDBGender.other),
        comment: 'เพศ',
    })
    gender: UserDBGender;

    @ApiProperty()
    @Column({
        allowNull: true,
    })
    weight: number;

    @ApiProperty()
    @Column({
        allowNull: true,
    })
    height: number;

    @ApiProperty()
    @Column({
        allowNull: true,
        comment: 'ค่าแคลอรี่ในแต่ละวัน',
    })
    target: number;

    @ApiProperty()
    @Column({
        allowNull: true,
        comment: 'ค่าแคลอรี่ที่ถูกคำนวณในเเต่ละวัน',
    })
    targetCal: number;

    @ApiProperty()
    @Column({
        allowNull: true,
        type: DataType.DATEONLY,
    })
    birthday: Date;

    @ApiProperty()
    @Column({
        allowNull: false,
        defaultValue: 'avatar.png',
    })
    image: string;

    // @ApiProperty()
    // @Column({
    //     defaultValue: false,
    //     allowNull: false,
    // })
    // isDelete: boolean;

    @CreatedAt
    readonly createdAt?: Date;

    @UpdatedAt
    readonly updatedAt?: Date;

    // ─────────────────────────────────────────────────────────────────

    @HasMany(() => UserSocketDB)
    userSocketLists: UserSocketDB[];

    @HasMany(() => UserPasswordDB)
    userPasswordLists: UserPasswordDB[];

    @HasMany(() => ReportDB)
    reportDBLists: ReportDB[];

    @HasMany(() => BmiDB)
    bmiDBLists: BmiDB[];

    @HasMany(() => FoodDB)
    foodLists: FoodDB[];
    // ─────────────────────────────────────────────────────────────────────────────
    // @ForeignKey(() => BmiDB)
    // @Column({
    //     allowNull: true,
    //     type: DataType.INTEGER,
    // })
    // bmiId: number;

    // @BelongsTo(() => BmiDB)
    // bmi: BmiDB;
}
