import Image from 'next/image'

import {
  faQuoteLeft,
  faQuoteRight,
  faStar,
  faStarHalf,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './styles.module.scss'

import Medico from '@/../public/medico.jpg'
import Homem2 from '@/../public/homem2.jpg'
import Homem3 from '@/../public/homem3.jpg'
import Mulher1 from '@/../public/mulher1.jpg'
import Mulher2 from '@/../public/mulher2.jpg'

export function PreviewContainer() {
  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewTitleAndInfo}>
        <h3>O que nosso membros dizem sobre nós?</h3>
        <span>
          Temos vários testemunhos de alguns de nossos membros! Veja a opinião
          deles:
        </span>
        <div className={styles.reviewerAvatars}>
          <Image src={Homem2} width={50} height={50} alt="Imagem de um homem" />
          <Image
            src={Mulher1}
            width={50}
            height={50}
            alt="Imagem de uma mulher"
          />
          <Image src={Homem3} width={50} height={50} alt="Imagem de um homem" />
          <Image
            src={Mulher2}
            width={50}
            height={50}
            alt="Imagem de uma mulher"
          />
          <strong>100+ avaliações</strong>
        </div>
      </div>
      <div className={styles.review}>
        <div className={styles.quote}>
          <FontAwesomeIcon icon={faQuoteLeft} size="5x" />
          <div className={styles.starContainer}>
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStarHalf} />
            4.5
          </div>
        </div>
        <div className={styles.reviewText}>
          <strong>Excelente atendimento!!</strong>
          <span>Fui atendido com muita educação e no tempo esperado!</span>
        </div>
        <div className={styles.quoteRight}>
          <div className={styles.reviewer}>
            <Image
              src={Medico}
              width={50}
              height={50}
              alt="Imagem de um médico"
            />
            <div>
              <strong>Leandro Silva</strong>
              <br />
              <span>25 anos de idade</span>
            </div>
          </div>
          <FontAwesomeIcon icon={faQuoteRight} size="5x" />
        </div>
      </div>
    </div>
  )
}
