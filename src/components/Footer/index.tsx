import Image from 'next/image'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'

import { faMailBulk, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'

import { GoogleMapsLink } from '../GoogleMapsLink'
import { Divider } from '../Divider'
import { ButtonIcon } from '../Buttons/ButtonIcon'

import styles from './styles.module.scss'

import Mapa from '@/../public/mapa.png'

export function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles['location-image-container']}>
        <div className={styles['location-image']}>
          <Image
            src={Mapa}
            alt="Mapa com a localização da Simply Nature"
            fill={true}
          />
        </div>
        <div className={styles['location-info']}>
          <div>
            <h1>Localização</h1>
            <div className={styles['info-container']}>
              <FontAwesomeIcon icon={faMapLocationDot} />
              <span>
                Heaven in earth - Spa Lagoon - Access DF 1021, Farm Nature.
                Brasília/DF
              </span>
            </div>
          </div>

          <div>
            <ButtonIcon variant="SECONDARY">
              <GoogleMapsLink
                title="TRAÇAR A ROTA"
                latitude={40.712776}
                longitude={-74.005974}
              />
            </ButtonIcon>
          </div>
        </div>
      </div>

      <Divider />

      <div className={styles.sectionContainer}>
        <section>
          <div className={styles['social-media-container']}>
            <Image src="/logo.png" alt="" width={200} height={200} />
          </div>
        </section>
        <section>
          <h2>Informações</h2>
          <div>
            <strong>CLINIMED CENTER</strong>
            <br />
            <span>CNPJ: XX.XXX.XXX/XXXX-XX</span>
          </div>
        </section>

        <section>
          <h1>Contato</h1>
          <div className={styles['info-container']}>
            <FontAwesomeIcon icon={faWhatsapp} />
            <a
              href="http://api.whatsapp.com/send?1=pt_BR&phone=5561995125151&text=Olá, tudo bem? Gostaria de informações sobre (...)"
              target="_blank"
              rel="noreferrer"
            >
              +55 (xx) xxxxx-xxxx
            </a>
          </div>
          <div className={styles['info-container']}>
            <FontAwesomeIcon icon={faMailBulk} />
            <a href={`mailto:exemple@clinimed-center.com`}>
              exemple@clinimed-center.com
            </a>
          </div>
          <div className={styles['social-media-icons']}>
            <Link
              href="https://www.instagram.com/chapadaindaia/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link
              href="https://www.instagram.com/chapadaindaia/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faPinterest} />
            </Link>
            <Link
              href="https://www.instagram.com/chapadaindaia/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
          </div>
        </section>
      </div>
    </footer>
  )
}
