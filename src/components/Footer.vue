<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconResume from './icons/IconResume.vue'
import IconGithub from './icons/IconGithub.vue'
import IconMail from './icons/IconMail.vue'
</script>

<template>
    <div class="content">
        <div class="footer-col-wrapper">
            <div class="footer-col">
                <div>About this site</div>
                <div>
                    Renjie's self-used homepage, mainly records some boring words and some photos.
                </div>
                <div>Made it just for learning vue and for fun.</div>
            </div>
            <div class="footer-col">
                <div>Links</div>
                <div>
                    <a href="https://github.com/Imanity"><IconGithub /><span>My Github</span></a>
                </div>
                <div>
                    <RouterLink to="/cv"><IconResume /><span>My CV</span></RouterLink>
                </div>
                <div>
                    <a href="mailto:imanity14@126.com"><IconMail /><span>Mail me</span></a>
                </div>
            </div>
        </div>
        <div class="footer-cprt">Copyright &copy; TangRenjie 2024</div>
    </div>
</template>

<style scoped>
.content {
    text-align: center;

    .footer-col-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;

        .footer-col {
            margin: 20px 80px;

            div:first-child {
                font-size: 20px;
                font-weight: bolder;
            }

            div {
                font-size: 16px;
                color: white;
                text-align: left;
                padding-top: 8px;

                a,
                RouterLink {
                    text-decoration: none;
                    color: inherit;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    span {
                        padding-left: 8px;
                    }
                }
                a:hover,
                RouterLink:hover {
                    filter: brightness(75%);
                }
            }
        }
    }

    .footer-cprt {
        color: darkslategray;
        padding-bottom: 12px;
    }
}
</style>
