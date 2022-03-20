import { deserialize, serialize } from "borsh";

class Assignable {
  constructor(properties) {
    Object.keys(properties).forEach(key => {
      this[key] = properties[key];
    });
  }

  encode() {
    return serialize(SCHEMA, this);
  }
}

export class Mail extends Assignable {

  static decode(bytes) {
    return deserialize(SCHEMA, Mail, bytes);
  }
}

export class MailAccount extends Assignable {

  static decode(bytes) {
    const dataLengthBuffer = Buffer.alloc(4);
    bytes.copy(dataLengthBuffer, 0, 0, 4);

    const dataLength = DataLength.decode(dataLengthBuffer);

    const accountDataBuffer = Buffer.alloc(dataLength.length);
    bytes.copy(accountDataBuffer, 0, 4, dataLength.length);
    return deserialize(SCHEMA, MailAccount, accountDataBuffer);
  }
}

export class DataLength extends Assignable {

  static decode(bytes) {
    return deserialize(SCHEMA, DataLength, bytes);
  }
}

const SCHEMA = new Map([
  [Mail, {kind: 'struct', fields: [
    ['id', 'string'],
    ['fromAddress', 'string'],
    ['toAddress', 'string'],
    ['subject', 'string'],
    ['body', 'string'],
    ['sentDate', 'string']
  ]}],
  [MailAccount, {kind: 'struct', fields: [
    ['inbox', [Mail]],
    ['sent', [Mail]]
  ]}],
  [DataLength, {kind: 'struct', fields: [
    ['length', 'u32']
  ]}]
]);
