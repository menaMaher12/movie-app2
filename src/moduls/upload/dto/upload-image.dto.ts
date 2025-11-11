/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class uplaodImageDto {
    @ApiProperty({ 
        type: 'string', 
        format: 'binary', 
        required: true,
        name:"file",
        description: 'Image file to upload' })
    file: Express.Multer.File;
}