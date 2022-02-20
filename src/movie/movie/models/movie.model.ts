export type CreateMovieDto = {
  name: string;
  translationKey: string;
  poster: string;
  description: string;
};

export type UpdateMovieDto = {
  name?: string;
  translationey?: string;
  poster?: string;
  description?: string;
};

export interface IMovieDto {
  _id: string;
  name: string | void;
  translationKey: string | void;
  poster: string | void;
  description: string | void;
}

export class MovieDto implements IMovieDto {
  readonly _id: string;
  readonly name: string | void;
  readonly translationKey: string | void;
  readonly poster: string | void;
  readonly description: string | void;
  readonly missingProperties: string[];

  get object(): IMovieDto {
    return {
      _id: this._id,
      name: this.name,
      translationKey: this.translationKey,
      description: this.description,
      poster: this.poster,
    };
  }

  static get emptyObject(): IMovieDto {
    return {
      _id: "",
      name: "Not Found",
      translationKey: "",
      description: "",
      poster: "",
    }
  }

  constructor(anime: IMovieDto) {
    const { _id, name, translationKey, poster, description } = anime;
    this.missingProperties = [];

    this._id = _id;
    this.name = name ?? this.addMissingProperties('name');
    this.translationKey = translationKey ?? this.addMissingProperties('translationKey');
    this.poster = poster ?? this.addMissingProperties('poster');
    this.description = description ?? this.addMissingProperties('description');
  }

  private addMissingProperties(propertyName: string): void {
    this.missingProperties.push(propertyName);
  }
}
