/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class uploadImagesDto{
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
        description: 'Array of image files to upload',
        required: true,
        name: "files"
    })
    files: Array<Express.Multer.File>;
}