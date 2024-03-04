import Image from 'next/image'
import Link from 'next/link'

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { HomeCard } from './components/HomeCard'
import { PreviewContainer } from './components/PreviewContainer'
import { MostWanted } from './components/MostWanted/MostWanted'
import { Slider } from '@/components/Slider'

import styles from './page.module.scss'

import HomeBackground from '@/../public/home-background.jpg'
import Medico from '@/../public/medico.jpg'
import Imagem1 from '@/../public/imagem1.jpg'

const IMAGES = [
  '/home-background.jpg',
  '/imagem1.jpg',
  '/imagem2.jpg',
  '/imagem3.jpg',
  '/imagem4.jpg',
  '/imagem5.jpg',
]

export default async function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <h1>CliniMed Center</h1>
        <Image
          src={HomeBackground}
          alt="Imagem do consultório"
          fill={true}
          priority={true}
        />
      </div>
      <section className={styles.sectionContainer}>
        <MostWanted />

        <HomeCard
          image={{ src: HomeBackground, alt: 'Imagem de um consultório' }}
        >
          <h3>
            Por que escolher a <span className={styles.green}>Clini</span>
            <span className={styles.red}>Med</span>
          </h3>
          <strong>Porque você sempre estará em primeiro lugar!</strong>
          <span>
            Na CliniMed está a mais de 20 anos atuando com saúde e bem estar,
            com respeito e profissionalismo!
          </span>
          <br />{' '}
          <span>
            Cumprimos com os horários dos agendamentos para o seu maior
            conforto!
          </span>
        </HomeCard>

        <HomeCard
          image={{ src: Medico, alt: 'Imagem de um médico' }}
          even={true}
        >
          <h3>Conheça nosso profissionais!</h3>
          <strong>Trabalhamos com os melhores!!</strong>
          <span>
            Na CliniMed reunimos os melhores profissionais! Tudo para cuidar de
            você com a excelência que merece!
          </span>
          <br />{' '}
          <span>
            São várias áreas de atendimento: cardiologista, psicólogo, pediatra,
            nutricionista...
          </span>
          <Link href="/professionals">
            Encontre o seu profissional{' '}
            <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </Link>
        </HomeCard>

        <HomeCard image={{ src: Imagem1, alt: 'Imagem de um médico' }}>
          <h3>Quer conhecer sobre Saúde?</h3>
          <strong>Leia uma de nossas publicações!!</strong>
          <span>
            Na CliniMed disponibilizamos os nossos melhores conhecimentos para
            que, você, possa sempre cuidar de sua saúde!
          </span>
          <br />{' '}
          <span>
            São vários assuntos: alimentação saudável, práticas de atividade
            físicas, mitos, verdades, e muito mais...
          </span>
        </HomeCard>

        <PreviewContainer />
        <Slider images={IMAGES} />
      </section>
    </div>
  )
}
