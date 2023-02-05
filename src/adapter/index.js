import PROVIDERS from '../common/providers';

export function findAdapter(room) {
  const exists = PROVIDERS.some((p) => p.name === room.provider);
  if (!exists) {
    throw new Error(`Can't find adapter for ${room.provider}`);
  }

  return require(`./${room.provider}`).default;
}
