export type CreateAnimeDto = {
  name: string;
  translationKey: string;
  poster: string;
  description: string;
};

export type UpdateAnimeDto = {
  name?: string;
  translationey?: string;
  poster?: string;
  description?: string;
};

export interface IAnimeDto {
  _id: string;
  name: string | void;
  translationKey: string | void;
  poster: string | void;
  description: string | void;
}

export class AnimeDto implements IAnimeDto {
  readonly _id: string;
  readonly name: string | void;
  readonly translationKey: string | void;
  readonly poster: string | void;
  readonly description: string | void;
  readonly missingProperties: string[];

  get object(): IAnimeDto {
    return {
      _id: this._id,
      name: this.name,
      translationKey: this.translationKey,
      description: this.description,
      poster: this.poster,
    };
  }

  constructor(anime: IAnimeDto) {
    const { _id, name, translationKey, poster, description } = anime;
    this.missingProperties = [];

    this._id = _id;
    this.name = name ?? this.addMissingProperties('name');
    this.translationKey =
      translationKey ?? this.addMissingProperties('translationKey');
    this.poster = poster ?? this.addMissingProperties('poster');
    this.description = description ?? this.addMissingProperties('description');
  }

  private addMissingProperties(propertyName: string): void {
    this.missingProperties.push(propertyName);
  }
}
