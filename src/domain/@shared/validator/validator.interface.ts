import Entity from "../entity/entity.abstract";

export default interface ValidatorInterface<T extends Entity=Entity> {
  validate(entity: T): void;
}
