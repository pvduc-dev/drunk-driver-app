import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { GeoLibService } from '@lib/geo-lib';
import { Location } from '@lib/db-lib';
import { DirectionRequestDto, DirectionResponseDto } from './dto/direction.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GetPlaceResponseDto,
  GetPlaceRequestDto,
  GetPlacesRequestDto,
  GetPlacesResponseDto,
} from './dto/place.dto';

@Controller('geo')
@ApiTags('Geo')
export class GeoController {
  constructor(private readonly geoLibService: GeoLibService) {}

  @Post('geocode')
  getGeocode(@Body() location: Location) {
    return this.geoLibService.getGeocode(location);
  }

  @Post('direction')
  @ApiOkResponse({
    type: DirectionResponseDto,
  })
  @HttpCode(200)
  async getDirection(
    @Body() body: DirectionRequestDto,
  ): Promise<DirectionResponseDto> {
    const direction = await this.geoLibService.getDirection(body.from, body.to);
    return {
      ...direction,
      price: direction.distance * 10000,
    };
  }

  @Post('places')
  @ApiOkResponse({
    type: GetPlacesResponseDto,
    isArray: true,
  })
  @HttpCode(200)
  async getPlaces(@Body() body: GetPlacesRequestDto) {
    return this.geoLibService.getPlaces(
      body.query,
      body.location ?? {
        coordinates: [105.864323, 20.981971],
      },
    );
  }

  @Post('place')
  @ApiOkResponse({
    type: GetPlaceResponseDto,
  })
  @HttpCode(200)
  async getPlace(
    @Body() body: GetPlaceRequestDto,
  ): Promise<GetPlaceResponseDto> {
    const place = await this.geoLibService.getPlace(body.placeId);
    return {
      address: place,
    };
  }
}
