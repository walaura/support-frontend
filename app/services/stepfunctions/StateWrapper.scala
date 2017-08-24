package services.stepfunctions

import java.util.Base64

import com.gu.support.workers.model.{ExecutionError, JsonWrapper}
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._

class StateWrapper(encryption: EncryptionProvider) {
  implicit private val executionErrorEncoder = deriveEncoder[ExecutionError]

  implicit private val wrapperEncoder = deriveEncoder[JsonWrapper]

  def wrap[T](state: T)(implicit encoder: Encoder[T]): String = {
    JsonWrapper(encodeState(state), None).asJson.noSpaces
  }

  private def encodeState[T](state: T)(implicit encoder: Encoder[T]): String = encodeToBase64String(encryption.encrypt(state.asJson.noSpaces))

  private def encodeToBase64String(value: Array[Byte]): String = new String(Base64.getEncoder.encode(value))
}
